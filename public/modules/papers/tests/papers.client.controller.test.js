'use strict';

(function() {
	// Papers Controller Spec
	describe('Papers Controller Tests', function() {
		// Initialize global variables
		var PapersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Papers controller.
			PapersController = $controller('PapersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Paper object fetched from XHR', inject(function(Papers) {
			// Create sample Paper using the Papers service
			var samplePaper = new Papers({
				name: 'New Paper'
			});

			// Create a sample Papers array that includes the new Paper
			var samplePapers = [samplePaper];

			// Set GET response
			$httpBackend.expectGET('papers').respond(samplePapers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.papers).toEqualData(samplePapers);
		}));

		it('$scope.findOne() should create an array with one Paper object fetched from XHR using a paperId URL parameter', inject(function(Papers) {
			// Define a sample Paper object
			var samplePaper = new Papers({
				name: 'New Paper'
			});

			// Set the URL parameter
			$stateParams.paperId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/papers\/([0-9a-fA-F]{24})$/).respond(samplePaper);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.paper).toEqualData(samplePaper);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Papers) {
			// Create a sample Paper object
			var samplePaperPostData = new Papers({
				name: 'New Paper'
			});

			// Create a sample Paper response
			var samplePaperResponse = new Papers({
				_id: '525cf20451979dea2c000001',
				name: 'New Paper'
			});

			// Fixture mock form input values
			scope.name = 'New Paper';

			// Set POST response
			$httpBackend.expectPOST('papers', samplePaperPostData).respond(samplePaperResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Paper was created
			expect($location.path()).toBe('/papers/' + samplePaperResponse._id);
		}));

		it('$scope.update() should update a valid Paper', inject(function(Papers) {
			// Define a sample Paper put data
			var samplePaperPutData = new Papers({
				_id: '525cf20451979dea2c000001',
				name: 'New Paper'
			});

			// Mock Paper in scope
			scope.paper = samplePaperPutData;

			// Set PUT response
			$httpBackend.expectPUT(/papers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/papers/' + samplePaperPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid paperId and remove the Paper from the scope', inject(function(Papers) {
			// Create new Paper object
			var samplePaper = new Papers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Papers array and include the Paper
			scope.papers = [samplePaper];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/papers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePaper);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.papers.length).toBe(0);
		}));
	});
}());